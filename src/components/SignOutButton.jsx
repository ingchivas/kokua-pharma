'use client'
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter()

  return (
    // Clicking on this button will sign out a user and reroute them to the "/" (home) page.
    // <button onClick={() => signOut(() => router.push("/"))}>
    //   Sign out
    // </button>

    <a
      href="#"
      onClick={() => signOut(() => router.push("/"))}
      className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-red-400 hover:text-gray-800 border-l-4 border-transparent hover:border-doradoUP-focus  pr-6"
    >
      <span className="inline-flex justify-center items-center ml-4 text-red-400">
        <LogoutOutlinedIcon />
      </span>
      <span className="ml-2 text-sm tracking-wide truncate">
        Logout
      </span>
    </a>
  );
};

export default SignOutButton;