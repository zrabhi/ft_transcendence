
import { useRef, useState } from 'react'
import { IoMdSearch, IoMdClose } from 'react-icons/io'
import { useRouter } from 'next/navigation';
import './SearchBar.scss'

export default function SearchBar() {

  const [searchValue, setSearchValue] = useState<string>('');
  const [searchState, setSearchState] = useState<string>('close');
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('searching...', searchValue);
      const url = `/searches/search?query=${searchValue}`;
      router.push(url);
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
        <input 
          type="text" 
          placeholder="search..." 
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
