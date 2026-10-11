import { useState } from 'react';                                  // ★
import { useParams, Link, useNavigate } from 'react-router-dom'; // ★ 1. useNavigate 추가
import { menuData } from '../data/menuData.js';
import StatusBadge from '../components/StatusBadge.jsx';

// ★ 사이즈 선택지 (컴포넌트 바깥: 렌더링마다 새로 만들 필요 없는 고정 데이터)
const SIZE_OPTIONS = [
  { key: 'regular', label: '레귤러', extra: 0 },
  { key: 'large', label: '라지 (+500원)', extra: 500 },
];

export default function MenuDetail({ onAddToCart }) {
  const { menuId } = useParams();
  const navigate = useNavigate();   // ★ 2. 담은 뒤 이동할 때 씀

  // ★ 손님이 고르는 값 3가지 (Hook이라 early return보다 위에)
  const [temp, setTemp] = useState('hot');
  const [size, setSize] = useState('regular');
  const [qty, setQty] = useState(1);

  const menu = menuData.find((m) => m.id === Number(menuId));

  if (!menu) {
    return (
      <div className="not-found-card">
        <h2>메뉴를 찾을 수 없어요</h2>
        <p className="page-desc">요청한 메뉴 번호({menuId})가 없습니다.</p>
        <Link to="/menu" className="btn btn-secondary">메뉴로 돌아가기</Link>
      </div>
    );
  }

  // ★ 합계 계산 (state가 아니라 매 렌더링마다 계산)
  const sizeExtra = SIZE_OPTIONS.find((s) => s.key === size).extra;
  const totalPrice = (menu.price + sizeExtra) * qty;

  // ★ 수량 조절: 이전 값을 바탕으로 바꾸니까 함수형 업데이트
  const handleDecrease = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQty((prev) => prev + 1);


    // ★ 3. 담기: 장바구니 항목을 만들어서 App에게 넘기고, 장바구니 화면으로 이동
  const handleAdd = () => {
    onAddToCart({
      cartId: Date.now(),                                // 장바구니 항목 고유 번호
      menuId: menu.id,
      name: menu.name,
      temp: menu.temp === 'both' ? temp : menu.temp,     // 고를 수 있는 메뉴만 고른 값, 아니면 메뉴의 온도
      size: menu.category === 'dessert' ? null : size,   // 디저트는 사이즈 없음
      qty: qty,
      unitPrice: menu.price + sizeExtra,                 // 사이즈 추가금 포함 1개 가격
    });
    navigate('/cart');
  };

  return (
    <div className="detail-card">
      <div className="detail-header">
        <h2 className="page-title">{menu.name}</h2>
        <StatusBadge temp={menu.temp} soldOut={menu.soldOut} />
      </div>
      <p className="page-desc">{menu.desc}</p>
      <p className="menu-price">{menu.price.toLocaleString()}원</p>

      {/* ★ 온도: 'both'인 메뉴만 보여줌 */}
      {menu.temp === 'both' && (
        <div className="option-group">
          <span className="option-label">온도</span>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="temp"
                value="hot"
                checked={temp === 'hot'}
                onChange={(e) => setTemp(e.target.value)}
              />
              HOT
            </label>
            <label>
              <input
                type="radio" // 여러개 중 하나만 고르는 동그라미
                name="temp" // 같은 name끼리 한 그루ㅜㅂ. 그룹 안에서 하나만 선택됨
                value="ice" // 이 버튼을 고르면 전달될 값
                checked={temp === 'ice'} // 동그라미를 채울지(true) 비울지(false) 정하는 속성. 
                onChange={(e) => setTemp(e.target.value)} // 클릭하면 state를 바꿈
              />
              ICE
            </label>
          </div>
        </div>
      )}

      {/* ★ 사이즈: 디저트가 아닐 때만 */}
      {menu.category !== 'dessert' && (
        <div className="option-group">
          <label className="option-label" htmlFor="size">사이즈</label>
          <select
            id="size"
            className="form-select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {SIZE_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* ★ 수량 */}
      <div className="option-group">
        <span className="option-label">수량</span>
        <div className="qty-control">
          <button type="button" className="qty-btn" onClick={handleDecrease}>-</button>
          <span className="qty-value">{qty}</span>
          <button type="button" className="qty-btn" onClick={handleIncrease}>+</button>
        </div>
      </div>

      {/* ★ 합계 */}
      <p className="detail-total">합계 {totalPrice.toLocaleString()}원</p>

      <div className="btn-row">
        <Link to="/menu" className="btn btn-secondary">목록으로</Link>
        {/* [11-1] 담기 버튼: 클릭하면 handleAdd 실행, 품절이면 비활성화 */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={menu.soldOut}
        >
          장바구니 담기
        </button>
      </div>
    </div>
  );
}