import StatusBadge from './StatusBadge.jsx';

export default function MenuCard({ name, price = 0, desc = '', temp = null, soldOut = false, children }) {
  return (
    <div className={`menu-card ${soldOut ? 'sold-out' : ''}`}>
      <div>
        <div className="menu-card-top">
          <h3 className="menu-name">{name}</h3>
          <StatusBadge temp={temp} soldOut={soldOut} />
        </div>
        <p className="menu-desc">{desc}</p>
        <p className="menu-price">{price.toLocaleString()}원</p>
      </div>

      {children && <div className="menu-card-footer">{children}</div>}
    </div>
  );
}