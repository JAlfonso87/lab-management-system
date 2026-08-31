import { useEffect, useState } from "react";
import { api } from "../axios/api";

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    api.get("auth/me")
      .then((result) => {
        setPermissions(result.data.permissions);
      })
      .catch(() => {
        setPermissions([]);
      });
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return {
    permissions,
    hasPermission,
  };
};