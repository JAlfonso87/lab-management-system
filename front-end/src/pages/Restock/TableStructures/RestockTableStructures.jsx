export const SELECTED_LOCATIONS_TABLE = [
  {
    render: (target) => target.host_building,
  },
  {
    render: (target) =>
      Object.hasOwn(target, "shelf_level_number") ? "ALMACÉN" : "LABORATORIO",
  },
  {
    render: (target) => target.shelf_number || "-",
  },
  {
    render: (target) => target.shelf_level_number || "-",
  },
  {
    render: (target) => target.local_stock_units,
  },
  {
    render: (target, prepareIncomingStock) => (
      <input
        style={{ width: "150px" }}
        type="number"
        min="1"
        onChange={(event) => prepareIncomingStock(target, event.target.value)}
        required
      />
    ),
  },
];
