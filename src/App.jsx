import { useState } from 'react';                     // ★ 1
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import MenuList from './pages/MenuList.jsx';
import MenuDetail from './pages/MenuDetail.jsx';
import Cart from './pages/Cart.jsx';
import OrderForm from './pages/OrderForm.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  // ★ 2. 장바구니 state
  // 여러 화면(Header, MenuDetail, Cart, OrderForm)이 같이 쓰는 데이터라 공통 부모인 App에 둠
  const [cart, setCart] = useState([]);

  // ★ 3. 장바구니에 추가하는 함수
  // 기존 배열(prev)을 펼쳐서 복사하고, 맨 뒤에 새 항목을 붙인 "새 배열"로 교체
  const addToCart = (newItem) => {
    setCart((prev) => [...prev, newItem]);
  };

  return (
    <div className="kiosk-app">
      {/* ★ 4. Header에는 개수만 내려줌 */}
      <Header cartCount={cart.length} />
      <main className="kiosk-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuList />} />
          {/* ★ 4. MenuDetail에는 추가 함수를 내려줌 (괄호 없이 함수 자체를 넘김) */}
          <Route path="/menu/:menuId" element={<MenuDetail onAddToCart={addToCart} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

  // [장바구니 담기 전체 흐름]
  // 1. MenuDetail 화면에서 [장바구니 담기] 클릭 -> handleAdd 실행
  // 2. handleAdd 안에서 onAddToCart(항목) 호출
  //    - onAddToCart는 App이 <MenuDetail onAddToCart={addToCart} />로 넘겨준 것
  //    - 새 함수가 아니라 App의 addToCart가 "onAddToCart라는 이름으로 전달된 것"
  //    - 그래서 실제로는 App에서 정의한 addToCart가 실행됨
  // 3. addToCart 안에서 setCart((prev) => [...prev, newItem]) 실행
  //    - 기존 장바구니(prev)를 펼쳐서 복사 + 뒤에 새 항목을 붙인 "새 배열"로 교체
  //    - push로 같은 배열에 넣으면 주소가 그대로라 화면이 안 바뀜 -> 꼭 새 배열
  // 4. cart(state)가 바뀌었으니 App이 처음부터 다시 그려짐
  //    - useState가 바뀐 cart를 돌려줌 -> cart.length 증가
  // 5. 부모(App)가 다시 그려지면 자식(Header)도 새 props를 받아 다시 그려짐
  //    - <Header cartCount={cart.length} /> -> cartCount가 0 -> 1
  //    - Header의 cartCount > 0 && ... 가 true -> 빨간 숫자 표시
  //    - Header 코드는 안 바꿨음. App이 내려주는 값만 바뀐 것
  // 6. MenuDetail은 onAddToCart 호출 다음 줄에서 navigate('/cart') -> 장바구니 화면으로 이동
  //    - 화면(DOM)은 바뀐 부분만 고쳐짐 (헤더 숫자, 본문 화면)
  // * 자식은 cart를 직접 못 바꿈. App이 준 함수를 호출해서 "바꿔줘"라고 요청만 함
  //   실제로 setCart를 부르는 건 항상 App (단일 진실 원천)

export default App;