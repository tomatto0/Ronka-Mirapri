import "../css/SearchResult.css";
import { useRef, useState, useEffect } from "react";
import { Item } from "../type/Item.ts";

export default function SearchResult({
  slot,
  search_result,
  edit_equiped_item,
  reset_keyword,
}: {
  slot: number;
  search_result: Item[];
  edit_equiped_item: (slot: number, item: Item) => void;
  reset_keyword: () => void;
}) {
  const SearchedItem = ({
    slot,
    item,
    edit_equiped_item,
    reset_keyword,
  }: {
    slot: number;
    item: Item;
    edit_equiped_item: (slot: number, item: Item) => void;
    reset_keyword: () => void;
  }) => {
    const component = useRef<HTMLDivElement | null>(null);
    const click_handler = () => {
      const dye_item = {
        ...item,
        DyeFirst: 0,
        DyeSecond: 0,
      };
      edit_equiped_item(slot, dye_item);
      reset_keyword();
    };

    return (
      <div className="search-result" ref={component} onClick={click_handler}>
        <img className="item-icon" src={"./" + item.Icon} alt={item.Name} />
        <span>{item.Name}</span>
      </div>
    );
  };

  const loader = useRef<HTMLDivElement | null>(null);
  const [is_loading, set_is_loading] = useState<boolean>(false);
  const [page, set_page] = useState<number>(1);
  const [show_result, set_show_result] = useState<Item[]>(
    search_result.slice(0, 10)
  );

  useEffect(() => {
    const load_more_result = () => {
      set_is_loading(true);
      setTimeout(() => {
        set_show_result(search_result.slice(0, (page + 1) * 10));
        set_page(page + 1);
        set_is_loading(false);
      }, 1000);
    };

    const observer = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          load_more_result();
        }
      },
      { threshold: 0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [page, is_loading, loader.current, search_result]);

  useEffect(() => {
    set_show_result(search_result.slice(0, 10));
  }, [search_result]);

  return (
    <div className="search-result-container">
      {show_result.map((item) => (
        <SearchedItem
          key={item.Id}
          slot={slot}
          item={item}
          edit_equiped_item={edit_equiped_item}
          reset_keyword={reset_keyword}
        />
      ))}
      {!is_loading && show_result.length < search_result.length && (
        <div ref={loader} className="loader"></div>
      )}
      {is_loading && (
        <div ref={loader} className="loader">
          <span></span>
        </div>
      )}
    </div>
  );
}
