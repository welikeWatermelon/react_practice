import MenuCard from '../components/MenuCard.jsx';
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';              // ★ 주소의 ?category= 읽고 쓰기
import { fetchMenus, CATEGORIES } from '../data/menuData.js';    // ★ CATEGORIES 추가 (중복 import는 삭제)


export default function MenuList() {

  // 1. 화면 상태 3가지
  const [menus, setMenus] = useState([]); // 받아온 메뉴
  const [loading, setLoading] = useState(true); // 불러오는 중인지
  const [error, setError] = useState(null); // 에러 메시지
  // useState내의 setxxx함수에서는 변수를 넣거나 함수를 넣을 수 있음.  

  // ★ 주소의 ?category= 값 읽기 (없으면 'all')
  // ★ Hook이라서 아래 early return(if loading...)보다 반드시 위에 있어야 함
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  // 2. 화면이 처음 나타날 때 한 번만 데이터 요청
  // useEffect 한번 실행 -> isMounted=true -> loadMenus로 함수 만들어놓음(실행안됨) -> loadMenus실행(31번째) -> 클린업함수 만들어서 return(아직실행안됨 - React에게 맡김) 
  // -> 사용자가 화면 끔 -> MenuList가 사라짐 -> isMounted=false -> fetchMenus로 데이터가져옴 -> if문돌아서 걍 무시. 

  // useEffect의 결과값으로는 함수가 하나 return되는데, 그게 react가 갖고있는거임. 그래서 만약 컴포넌트가 없어지면(화면이 바뀌면) react가 갖고있는 함수가 실행되는거임
  // useEffect함수는 return 할수도 안할수도 있는 함수임. return 하는거면 그걸 react가 갖고있는거고, 안하면 그냥 안하는거고. 보통 클린업 함수를 맡겨둠

  useEffect(() => {
    let isMounted = true;

    const loadMenus = async() => {
      try{
        // await : await는 결과값을 기다리며, 여기서 잠시 멈춰서 밑으로 내려가고 있지 않은 상태임. 결과가 오면 그걸 가지고 내려감
        // await, promise, resolve, reject랑 짝꿍
        const data = await fetchMenus();
        if(isMounted) setMenus(data);
        // 지역변수에 있는 data를 state로 올리는 역할을 setMenus(data)가 함. 
      }catch (err){
        if(isMounted) setError(err.message);
      }finally{
        if(isMounted) setLoading(false);
      }
    };

    loadMenus();

    // 3. 클린업 : 화면이 사라지면 결과가 와도 무시
    return () => {
      isMounted = false;
    };
  }, []);

  // ★ 필터 버튼 클릭 시 주소의 category 값을 바꿈 → 주소가 바뀌면 화면이 다시 그려짐
  const handleFilter = (key) => {
    if (key === 'all') {
      setSearchParams({});                  // ★ ?category= 자체를 지움
    } else {
      setSearchParams({ category: key });   // ★ ?category=coffee
    }
  };

  // ★ 화면에 보여줄 목록 계산 (menus와 currentCategory로 계산 가능하니 state로 만들지 않음)
  const filteredMenus =
    currentCategory === 'all'
      ? menus
      : menus.filter((menu) => menu.category === currentCategory);

    // 4. 상태별로 다른 화면 (early return)
  if (loading) {
    return <div className="loading-box">메뉴를 불러오는 중입니다...</div>;
  }
  if (error) {
    return <div className="error-box">{error}</div>;
  }

  return (
    <div>
      <h2 className="page-title">메뉴</h2>
      <p className="page-desc">원하는 메뉴를 골라주세요</p>

      {/* ★ 카테고리 필터 버튼: CATEGORIES 배열을 map으로 버튼으로 바꿈 */}
      {/* ★ 현재 카테고리와 같은 버튼에만 active 클래스 → 갈색으로 강조 */}
      <div className="filter-group">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`filter-btn ${currentCategory === cat.key ? 'active' : ''}`}
            onClick={() => handleFilter(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {/* ★ menus → filteredMenus 로 변경 */}
        {filteredMenus.map((menu) => (
          <MenuCard
            key={menu.id}
            name={menu.name}
            price={menu.price}
            desc={menu.desc}
            temp={menu.temp}
            soldOut={menu.soldOut}
          >
            {menu.soldOut ? (
            <button type="button" className="btn" disabled>품절</button>
            ) : (
            <Link to={`/menu/${menu.id}`} className="btn btn-primary">상세 보기</Link>
            )}
          </MenuCard>
        ))}
      </div>
    </div>
  );
}

  // [카테고리 필터 전체 흐름]
  // 1. 필터 버튼([커피] 등) 클릭 -> onClick={() => handleFilter(cat.key)} 실행
  // 2. handleFilter 동작
  //    - 'all'이면 setSearchParams({})  -> 주소에서 ?category= 자체를 지움
  //    - 아니면 setSearchParams({ category: key }) -> 주소를 ?category=coffee 로 바꿈
  // 3. 주소가 /menu -> /menu?category=coffee 로 바뀜
  //    - useSearchParams는 useState가 아니라 React Router의 Hook임
  //    - 값을 React 내부가 아니라 "주소창의 ? 뒷부분"에 저장함
  //    - 경로(/menu)는 그대로, ? 뒷부분만 바꿈. 새로고침은 안 일어남
  // 4. 주소가 바뀌었으니 MenuList 함수가 "처음부터" 다시 실행됨 (리렌더링)
  //    - 아래 코드로 바로 점프하는 게 아님. 위에서부터 다시 쭉 실행됨
  //    - menus(8개), loading(false)는 state라서 그대로 유지됨
  //    - useEffect는 []라서 다시 실행 안 됨 -> 메뉴를 다시 불러오지 않음
  // 5. useSearchParams()가 바뀐 주소를 읽음
  //    -> searchParams.get('category') = 'coffee'
  //    -> currentCategory = 'coffee' (없으면 || 'all' 때문에 'all')
  // 6. filteredMenus 다시 계산
  //    - 'all'이면 menus 그대로, 아니면 menus.filter로 해당 카테고리만 거름
  //    - 원본 menus는 안 건드림. 그래서 [전체] 누르면 다시 8개 다 나옴
  //    - menus + currentCategory로 언제든 계산 가능하니까 state로 안 만듦
  // 7. return JSX
  //    - 필터 버튼: currentCategory와 같은 버튼에만 active 클래스 -> 갈색 강조
  //    - filteredMenus.map -> 걸러진 메뉴들을 MenuCard 형식으로 다시 깔아줌
  // 8. 화면에 커피 메뉴만 남음
  //    - 주소에 저장돼서 새로고침/뒤로가기 해도 필터 유지됨