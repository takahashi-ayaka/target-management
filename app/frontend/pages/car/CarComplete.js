import React from "react"
import MenuButton from "../../components/MenuButton"

const CarComplete = () => {
  return (
    <main>
      <h1>車両情報登録完了画面</h1>
      <form>
        <div>
          <label>登録が完了しました。</label>
          <MenuButton />
        </div>
      </form>
    </main>
  );
}

export default React.memo(CarComplete);
