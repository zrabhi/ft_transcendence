import { faChevronDown, faCircleChevronDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ScrollDown = () => {
  return (
    <div className="scroll-down">
      <p>scroll down</p>
      <FontAwesomeIcon icon={faCircleChevronDown} />
    </div>
  );
}

export default ScrollDown;
