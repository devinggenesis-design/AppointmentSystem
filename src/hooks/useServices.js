import { useEffect, useState } from "react";

export default function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/services")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => active && setServices(data))
      .catch(
        () => active && setError("Couldn't load services. Please try again."),
      )
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return { services, loading, error };
}
