import pandas as pd
import os
import requests

#CSV raw data 읽어오기
raw_data = pd.read_csv('./src/csv/item.csv', header=1, index_col=0, low_memory=False)
raw_data.drop(['int32', '0'], axis=0, inplace=True)

#필요한 행(이름, 아이콘, 염색 수, ...)만 잘라서 items로 저장
items = raw_data[['Singular', 'Icon', 'DyeCount', 'ClassJobCategory', 'EquipSlotCategory', 'ItemSortCategory', 'Unnamed: 20']].copy()
items.index = pd.to_numeric(items.index)
items['Singular'] = items['Singular'].astype('string')
items['Icon'] = items['Icon'].astype('string')
items['DyeCount'] = pd.to_numeric(items['DyeCount'])
items['ClassJobCategory'] = pd.to_numeric(items['ClassJobCategory'])
items['EquipSlotCategory'] = pd.to_numeric(items['EquipSlotCategory'])
items['ItemSortCategory'] = pd.to_numeric(items['ItemSortCategory'])
items['Unnamed: 20'] = pd.to_numeric(items['Unnamed: 20'])

#착용가능한(equip slot category이 지정됨 + class job category가 지정됨) 아이템 필터링
equipable_items = items[(items['EquipSlotCategory'] != 0) & (items['ClassJobCategory'] != 0)].copy()

#필요 없는 아이템 삭제
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^햇살의')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^햇빛살')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^안개돋이')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^짙은안개')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^안개넘이')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^에테르 깃든')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^구식')].index, inplace=True)
equipable_items.dropna(subset='Singular', inplace=True)

#스타일카탈로그 (안경 시리즈) 아이템 필터링, 염색 수, 장착슬롯, 장착클래스 등 지정
style_items = items[items['Singular'].str.contains('스타일카탈로그: ')].copy()
style_items.loc[style_items.index, 'DyeCount'] = 1
style_items.loc[style_items.index, 'ClassJobCategory'] = 1
style_items.loc[style_items.index, 'EquipSlotCategory'] = 24

#패션 소품 아이템 필터링
fashion_items = items[(items['Unnamed: 20'].isin([30120, 30140, 30180])) & (items['ItemSortCategory'] == 59)]
fashion_items.loc[:, 'ClassJobCategory'] = 1
fashion_items.loc[:, 'EquipSlotCategory'] = 24

#착용가능한 아이템 + 스타일카탈로그를 합친 데이터
filtered_items = pd.concat([equipable_items, style_items, fashion_items])

#아이콘 넘버링을 경로로 수정
filtered_items.Icon = '/i/0'+filtered_items.Icon.str[:2]+'000/0'+filtered_items.Icon+'_hr1.png'

#실장 안된 이벤트 아이템 필터링(할 때마다 수정해주세요)
filtered_items.drop(axis=0, index=filtered_items[filtered_items.Singular.str.contains('밤의 악마')].index, inplace=True)

#index를 id로, 컬럼명 수정
filtered_items.reset_index(inplace=True)
filtered_items.drop(['ItemSortCategory', 'Unnamed: 20'], axis=1, inplace=True)
filtered_items.columns = ['Id', 'Name', 'Icon', 'DyeCount', 'ClassJobCategory', 'EquipSlotCategory']

#json으로 저장
filtered_items.to_json('./src/json/filtered_items.json', orient='records', indent=2, force_ascii=False)
filtered_items.to_csv('./src/csv/filtered_items.csv', encoding='utf-8-sig')

#image 저장
for i, url in enumerate(filtered_items['Icon']):
    path = './public/' +'/'.join(url.split('/')[:-1])
    filename = url.split('/')[-1]

    if not os.path.exists(path):
        os.makedirs(path)

    if not os.path.exists(os.path.join(path, filename)):
        try:
            res = requests.get('https://xivapi.com' +url)
            if res.status_code == 200:
                os.system('curl https://xivapi.com' +url +' > ' +os.path.join(path, filename))
            else:
                print('download fail: status:', res.status_code, url)
        except:
            print('download fail:', url)

print(f'\r{i/len(filtered_items['Icon']): .2%} {i} / {len(filtered_items['Icon']) -1}: {url}', end='')