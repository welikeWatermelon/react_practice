import { Link, NavLink } from 'react-router-dom';

// Link : 클릭하면 다른 주소로 이동하는 링크. React용 <a> 태그

export default function Header({ cartCount = 0 }) {
  // NavLink가 넘겨주는 { isActive }를 받아서 클래스명을 돌려주는 함수
  const getNavClass = ({ isActive }) => (isActive ? 'nav-item active' : 'nav-item');

  return (
    <header className="kiosk-header">
        {/* 클릭하면 / 주소로 이동함. 즉 홈으로 가는거지 */}
      <Link to="/" className="kiosk-logo">☕ 카페 키오스크</Link> 

        {/* NavLink는 현재 페이지와 동일한지 true/false를 줌. 지금 장바구니 화면에 있고 메뉴바를 보면 장바구니 버튼만 진하게 표시되도록 하는 기능  */}
      <nav className="nav-menu">
        <NavLink to="/" end className={getNavClass}>홈</NavLink>
        <NavLink to="/menu" className={getNavClass}>메뉴</NavLink>
        <NavLink to="/cart" className={getNavClass}>
          장바구니
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </NavLink>
      </nav>
    </header>
  );
}