function TableHeaders({ headers }) {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <td>{header}</td>
        ))}
      </tr>
    </thead>
  );
}
export default TableHeaders;
