import { LeafIcon } from './Icons'

export const Logo = ({ onClick }) => (
  <div 
    className="logo" 
    onClick={onClick} 
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <LeafIcon />
    <span className="logo-green">Green</span>
    <span className="logo-mile">Mile</span>
  </div>
)

export default Logo
