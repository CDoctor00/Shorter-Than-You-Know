import { FaCheck } from "react-icons/fa6";

export interface row {
  id: number;
  feature: string;
  signed: React.ReactNode;
  free: React.ReactNode;
}

export const rows: row[] = [
  {
    id: 0,
    feature: "Custom Prefix",
    signed: <FaCheck />,
    free: <FaCheck />,
  },
  {
    id: 1,
    feature: "Password",
    signed: <FaCheck />,
    free: <FaCheck />,
  },
  {
    id: 2,
    feature: "Expiration Time",
    signed: <FaCheck />,
    free: <FaCheck />,
  },
  {
    id: 3,
    feature: "History",
    signed: <FaCheck />,
    free: <></>,
  },
  {
    id: 4,
    feature: "Note",
    signed: <FaCheck />,
    free: <></>,
  },
  {
    id: 5,
    feature: "Enable/Disable",
    signed: <FaCheck />,
    free: <></>,
  },
  {
    id: 6,
    feature: "Update Expiration Time",
    signed: <FaCheck />,
    free: <></>,
  },
  {
    id: 7,
    feature: "Statistics",
    signed: <FaCheck />,
    free: <></>,
  },
];
