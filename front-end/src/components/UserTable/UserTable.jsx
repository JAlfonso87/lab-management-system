import UserTableEntry from "./UserTableEntry";

function UserTable({ data, setter, handleRefresh }) {
  const headers = [
    "LABORATORIO",
    "NOMBRE/S",
    "USUARIO",
    "TELÉFONO DE CONTACTO",
    "ACCIONES",
  ];

  return (
    <table className="stock-table">
      <thead>
        <tr>
          {headers.length != 0
            ? headers.map((header) => {
                <td>
                  <strong>{header}</strong>
                </td>;
              })
            : null}
        </tr>
      </thead>
      <tbody>
        {data != undefined
          ? data.map((user) => (
              <UserTableEntry
                key={user.user_id}
                user={user}
                setUsers={setter}
                handleRefresh={handleRefresh}
              />
            ))
          : null}
      </tbody>
    </table>
  );
}

export default UserTable;
