import { useGameStore } from "../../../store/game";

export const Game = () => {
  const { userInvited, userInviting } = useGameStore();
  return (
    <div>
        <p>Game</p>
        <p>userInvited: { userInvited }</p>
        <p>userInviting: { userInviting }</p>
    </div>
  )
}
