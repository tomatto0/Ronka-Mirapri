import { useEffect, useState } from "react";
import "../css/Redirect.css";
import { createPortal } from "react-dom";

type RedirectRonkaLookbookProps = {
  onRedirect: () => void; // 매개변수 없고 반환값 없는 함수
};

export default function RedirectRonkaLookbook({ onRedirect }: RedirectRonkaLookbookProps) {
  const [countdown, setCountdown] = useState(5); // 5초 카운트다운

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = "https://lookbook.ronkacloset.com/editor"; // 외부 도메인 주소
    }
  }, [countdown]);

  return createPortal(
    <div className="modal-background">
      <div className="modal-wrap">
        <div className="modal-title-wrap">
          <h2 className="modal-title">안내드립니다</h2>
        </div>
        <div className="scripts-box">
          <p className="modal-script">
            현재 사이트는 <strong>롱카의 룩북?</strong> 프로토타입으로,&nbsp;
          </p>
          <p className="modal-script">더 이상 업데이트되지 않습니다.</p>
        </div>
        <div className="scripts-box">
          <p className="modal-script">
            새로운 <strong>롱카의 룩북?</strong>에서 코디 이미지 생성과&nbsp;
          </p>
          <p className="modal-script">나만의 글 작성 기능을 이용해보세요.</p>
        </div>
        <div className="button-wrap">
          <button onClick={onRedirect} className="modal-button">
            텔레포 즉시시전
          </button>
        </div>
        <p className="modal-count">텔레포 시전 중...{countdown}초 </p>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
}
