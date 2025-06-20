import { useAuthStore } from "../store/store";

const Profile = () => {
  const { role, username, firstName, lastName } = useAuthStore();

  if (!username) {
    return (
      <div className="flex justify-center my-20">
        <p className="text-lg">No profile data. Please login first.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-20">
      <div className="border border-gray-300 flex flex-col justify-center space-y-2 hover:bg-gray-50 transition rounded-lg px-6 mb-6 shadow-md min-w-96">
        <div className="rounded-full w-20 h-20 bg-gray-200 shadow m-auto my-10"></div>

        <div className="flex flex-col justify-center items-center gap-y-4 py-10 px-6 text-lg font-medium">
          <span>Username: {username}</span>
          {role === "user" && (
            <>
              <span>First Name: {firstName}</span>
              <span>Last Name: {lastName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
