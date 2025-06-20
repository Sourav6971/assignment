import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const menu = ["Home", "Books", "Profile", "Login"];
  const navigate = useNavigate();
  return (
    <div className="px-110 py-20">
      <div className="flex justify-between px-15 py-2 font-mono text-xl border-4 rounded-2xl">
        {menu.map((value, index) => (
          <div
            key={index}
            className="cursor-pointer hover:scale-105"
            onClick={() => navigate(`/${value}`)}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
