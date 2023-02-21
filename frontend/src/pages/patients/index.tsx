import { useCallback, useEffect, useState } from "react";

export default function Patients({
  inject: {
    repository: { patient: patientRepository },
  },
}: any) {
  const [patients, setPatients] = useState<any[]>([]);

  const loadPatients = useCallback(async () => {
    const patients = await patientRepository.getAll();

    setPatients(patients);
  }, [patientRepository]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  return (
    <>
      <h1>Patients</h1>
      {JSON.stringify(patients)}
    </>
  );
}
