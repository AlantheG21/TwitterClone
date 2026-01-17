import XSvg from "../../../components/svgs/X"

const SignUpPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex justify-center items-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <form className="lg:w-2/3 mx-auto md:mx--20 flex gap-4 flex-col">
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            
          </label>
        </form>
      </div>

    </div>
  )
}

export default SignUpPage