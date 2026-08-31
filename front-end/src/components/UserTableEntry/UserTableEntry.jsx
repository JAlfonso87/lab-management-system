import { api } from "../../axios/api"
import "./UserTableEntry.css"

function UserTableEntry({
  user,
  users,
  setUsers,
  handleRefresh
}) {

  const approveUser = () => {
    api.post('users/approve', {}, {
      params: {
          target: user.user_id
        }
    })
    .then((response) => {
        setUsers(prev => prev.filter((entry) => entry.user_id == user.user_id))
        console.log(response.status)
        handleRefresh()
    })
    .catch((error) => console.error(error))
  }

  const discardUser = () => {
      api.post('users/terminate', {}, {
        params: {
          target: user.user_id
        }
      })
      .then((response) => {
        setUsers(prev => prev.filter((entry) => entry.user_id == user.user_id))
        console.log(response.status)
        handleRefresh()
      })
      .catch((error) => console.error(error))
  }

  return (
    <tr className="user-entry-data">
      <td>{"LAB. DE " + user.labs.lab_name}</td>
      <td>{user.user_first_name + " " + (user.user_last_name + " ") + user.user_middle_name ?? ""}</td>
      <td>{user.user_username}</td>
      <td>{user.user_phone_number}</td>
      <td>
        {
            <>
              <button
                className="user-entry-edit-button"
                type="button"
                style = { {marginRight: "5px"} }
                onClick = { () => approveUser()}
              >
                Aprobar Solicitud
              </button>
              <button
                className="user-entry-delete-button"
                type="button"
                style = { {marginLeft: "5px"} }
                onClick = { () => discardUser()}
              >
                Descartar Solicitud
              </button>
            </>
        }
      </td>
    </tr>
  );
}

export default UserTableEntry;