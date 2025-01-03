export default function SearchResult(props) {
    return (
        <div className='search-result-container'>
            {props.search_result.map(res => (
                <div className="search-result" key={res.Id}>
                    {/* <img src={'https://xivapi.com' + res.Icon} alt={res.Name}/> */}
                    <img src={'./' + res.Icon} alt={res.Name}/>
                    <p>{res.Name}</p>
                </div>
            ))}
        </div>
    )
}