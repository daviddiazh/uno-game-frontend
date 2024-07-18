import { useContext } from "react"
import { AuthContext } from "../../../context/auth/AuthContext"

export const Options = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <p>Options</p>
      <button onClick={logout}>logout</button>
    </div>
  )
}
