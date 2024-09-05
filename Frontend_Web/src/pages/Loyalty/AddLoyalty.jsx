import { Input, Textarea, Select, Option, Button } from "@material-tailwind/react";

const AddLoyalty = () => {
    return(
        <div class="h-dvh">
            <div className="relative w-full mx-36 mt-5 flex left-28">
                <div className="w-4/6 mr-2">
                {" "}
                <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 text-left overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
                    <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-auto max-w-full px-3 my-auto">
                        <div className="h-full">
                        <h5 className="mb-8 ml-32 text-black font-semibold text-3xl text-center">
                            Add New Loyalty Customers
                        </h5>
                        </div>
                    </div>
                    </div>
                    <span className="block text-base font-medium text-gray-700 ml-3">
                    Phone Number :
                    </span>
                    <Input
                    type="number"
                    placeholder="Enter phone number"
                    style={{ width: "97%" }}
                    className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                        className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                    />

                    <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                    Full Name :
                    </span>
                    <Input
                    type="text"
                    placeholder="Enter customer full name"
                    style={{ width: "97%" }}
                    className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                        className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                    />

                    <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                    Email :
                    </span>
                    <Input
                    type="text"
                    placeholder="Enter customer email address"
                    style={{ width: "97%" }}
                    className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                        className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                    />

                    <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                    Address :
                    </span>
                    <Input
                    type="text"
                    placeholder="Enter customer home address"
                    style={{ width: "97%" }}
                    className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                        className: "hidden",
                    }}
                    containerProps={{ className: "min-w-[100px]" }}
                    />

                    <div className="flex items-center">
                        <div className="flex-1 text-left">
                            <span className="block text-sm font-medium text-gray-700 ml-3 mt-5">
                            Gender :
                            </span>
                            <div
                            style={{ width: "250px" }}
                            className=" ml-3"
                            >
                            <Select
                                size="lg"
                                labelProps={{
                                className: "hidden",
                                }}
                            >
                                <Option>Male</Option>
                                <Option>Female</Option>
                            </Select>
                            </div>
                        </div>

                        <div className="mr-16">
                            <span className="block text-base font-medium text-gray-700 ml-3 mt-5">
                                DOB:
                            </span>
                            <Input
                                type="date"
                                placeholder="Enter customer date of birth"
                                style={{ width: "200px" }}
                                className="!border !border-gray-300 mx-3 mt-1 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:ring-gray-900/10 !px-3 !py-2 box-border"
                                labelProps={{
                                    className: "hidden",
                                }}
                                containerProps={{ className: "min-w-[100px]" }}
                            />
                        </div>
                    </div>
                    <div className="mt-10 ml-72">
                    <button
                        className="select-none bg-opacity-25 bg-blue-600 rounded-lg border border-blue-300 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-light-blue-700 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                    >
                        Create
                    </button>
              </div>

                </div>
                </div>
            </div>
        </div>

    )
}

export default AddLoyalty;