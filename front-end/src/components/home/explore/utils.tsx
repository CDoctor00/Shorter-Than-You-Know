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
    feature: "homePage.features.customPrefix.title",
    signed: <FaCheck className="tale-icon" />,
    free: <FaCheck className="tale-icon" />,
  },
  {
    id: 1,
    feature: "homePage.features.password.title",
    signed: <FaCheck className="tale-icon" />,
    free: <FaCheck className="tale-icon" />,
  },
  {
    id: 2,
    feature: "homePage.features.expirationTime.title",
    signed: <FaCheck className="tale-icon" />,
    free: <FaCheck className="tale-icon" />,
  },
  {
    id: 3,
    feature: "homePage.features.history.title",
    signed: <FaCheck className="tale-icon" />,
    free: <></>,
  },
  {
    id: 4,
    feature: "homePage.features.note.title",
    signed: <FaCheck className="tale-icon" />,
    free: <></>,
  },
  {
    id: 5,
    feature: "homePage.features.status.title",
    signed: <FaCheck className="tale-icon" />,
    free: <></>,
  },
  {
    id: 6,
    feature: "homePage.features.updateExpirationTime.title",
    signed: <FaCheck className="tale-icon" />,
    free: <></>,
  },
  {
    id: 7,
    feature: "homePage.features.statistics.title",
    signed: <FaCheck className="tale-icon" />,
    free: <></>,
  },
];
