import { useNavigate } from 'react-router-dom';
// 코드로 주소를 이동시키는 함수를 꺼내주는 Hook
// navigage('/menu') 호출하면 /menu로 이동
// '/menu' : 절대 (루트부터)
// 'menu' : 상대 (현재 경로 기준)

export default function Home() {

    const navigate = useNavigate();
    return (
        <section className = "home-hero"> 
            <h1 className = "home-title"> 어서 오세요 ☕</h1>
            <p className = "home-desc">버튼을 눌러 주문을 시작해 주세요</p>
            <button
            type = "button"
            className = "btn btn-primary btn-large"
            onClick={() => navigate('/menu')}>
                주문하기
            </button>
            {/* onClick={navigate('/menu')}        // 화면을 그리는 순간 바로 실행돼버림 */}
            {/* onClick={() => navigate('/menu')}  // 클릭했을 때 실행됨 */}
        </section>
    );
}