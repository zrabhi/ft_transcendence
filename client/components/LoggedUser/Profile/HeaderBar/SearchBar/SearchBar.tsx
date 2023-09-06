import { useRef, useState } from 'react'
import { IoMdSearch, IoMdClose } from 'react-icons/io'
import './SearchBar.scss'

export default function SearchBar() {

  const [searchState, setSearchState] = useState<string>('close');
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const handleIconClick = () => {
    if (searchState === 'close') {
      setSearchState('open');
      searchBoxRef.current?.classList.add('open');
      searchBoxRef.current?.classList.remove('close')
    } else {
      setSearchState('close');
      searchBoxRef.current?.classList.remove('open');
      searchBoxRef.current?.classList.add('close')
    }
  }

  return (
    <div className="search-bar">
      <div className="icon" onClick={handleIconClick}>
        {
          searchState === 'close' ?
            <IoMdSearch /> :
            <IoMdClose />
        }
      </div>
      <div ref={searchBoxRef} className="search-box">
        <input type="text" placeholder="search..." />
      </div>
    </div>
  )
}
