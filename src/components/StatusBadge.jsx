// 
export default function StatusBadge({temp, soldOut = false}){
    // 1. 품절이면 온도와 상관없이 품절 뱃지를 먼저 반환
    if(soldOut){
        return <span className = "badge badge-soldout">품절</span>
    }

    // 2. 온도에 따라 클래스와 글자 결정
    let badgeClass = "";
    let label = "";

    if(temp==='hot'){
        badgeClass = 'badge badge-hot';
        label = 'HOT';
    }else if(temp==='ice'){
        badgeClass = 'badge badge-ice';
        label = 'ICE';
    }else{
        // 3. 'both'나 null 이면 뱃지를 그리지 않음
        return null;
    }

    return <span className={badgeClass}>{label}</span>;
}