import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/_layout";
import { AutoComplete, Button, Input, Modal, Select, Table } from "antd";
import { CgAdd } from "react-icons/cg";
import { months } from "../months";
import { memberServices, savingServices } from "../services/api";
import { toast } from "sonner";
import { MdOutlineSavings } from "react-icons/md";

const Shares = () => {
  const [open, setOPen] = useState(false);
  const [members, setmembers] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [totalshares, setTotalshares] = useState(0);

  const columns = [
    {
      title: "S/NO",
      dataIndex: "no",
      key: "no",
    },

    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },

    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },

    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "month",
      dataIndex: "month",
      key: "month",
    },

    {
      title: "payment type",
      dataIndex: "payment_type",
      key: "payment_type",
    },

    {
      title: "saving type",
      dataIndex: "savings_type",
      key: "savings_type",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.savings_id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
    setNewSavings({
      ...newSavings,
      user_id: record.user_id,
      amount: record.amount,
      savings_type: record.savings_type,
    });
    setOPen(true);
  };

  const [shares, setShares] = useState([]);
  const [member, setMember] = useState("");

  const [newSavings, setNewSavings] = useState({
    user_id: "",
    amount: "",
    month_paid: "",
    payment_type: "",
    savings_type: "shares",
  });

  const fetchAllMember = async () => {
    const data = await memberServices.Allmembers();
    setmembers(data);
  };

  useEffect(() => {
    fetchAllMember();
  }, []);

  const fetchShares = async () => {
    try {
      const res = await savingServices.getAllshares();
      const data = await savingServices.getTotalshares();
      setTotalshares(data[0] || 0);
      setShares(res); // Make sure your backend returns an array
      console.log(res);
    } catch (error) {
      toast.error("Error fetching savings");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting shares:", newSavings);
    try {
      await savingServices.addsavings(
        newSavings.user_id,
        newSavings.amount,
        newSavings.month_paid,
        newSavings.payment_type,
        newSavings.savings_type
      );

      setNewSavings({
        user_id: "",
        amount: "",
        month_paid: "",
        payment_type: "",
        savings_type: "",
      });
      fetchShares();
      console.log(newSavings);
    } catch (error) {
      toast.error("Failed to add shares");
    }
  };

  useEffect(() => {
    fetchShares();
  }, []);

  return (
    <>
      <DashboardLayout>
        <div className="">
          <div className="w-[250px] h-[150px] rounded-md border border-gray-300 p-5 ">
            <div className="flex flex-col gap-4">
              <MdOutlineSavings size={50} className="text-gray-400" />
              <h1>Total development</h1>
            </div>

            <h1 className="text-2xl font-bold">
              &#8358;
              {Intl.NumberFormat().format(totalshares ? totalshares.total : 0)}
            </h1>
          </div>
        </div>

        <div className="flex justify-between items-center ">
          <h1 className="my-5 text-3xl font-bold">Shares</h1>

          <Button onClick={() => setOPen(true)}>
            <CgAdd /> New Shares
          </Button>
          <Modal open={open} footer={null} onCancel={() => setOPen(false)}>
            <div className="mb-10">
              <h1 className="text-2xl text-slate-300">Shares Form</h1>
            </div>

            <form className="" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 my-4">
                <label htmlFor="">Select User</label>
                <AutoComplete
                  className="w-[100%]"
                  value={member}
                  options={members.map((member) => ({
                    label: member.fullname,
                    value: `${member.user_id} ${member.fullname}`,
                  }))}
                  onChange={(value) => {
                    setMember(value.split(" ")[1]);
                    setNewSavings({
                      ...newSavings,
                      user_id: value.split(" ")[0],
                    });
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 my-4">
                <label htmlFor=""> Amount</label>
                <Input
                  type="number"
                  className="w-[100%]"
                  value={newSavings.amount}
                  onChange={(e) =>
                    setNewSavings({ ...newSavings, amount: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 my-4">
                <label htmlFor=""> Month</label>
                <Select
                  placeholder="Select saving month"
                  options={months.map((m) => ({
                    label: m.label,
                    value: m.value,
                  }))}
                  onChange={(value) =>
                    setNewSavings({ ...newSavings, month_paid: value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2 my-4">
                <label htmlFor="">payment type</label>
                <Input
                  type="text"
                  className="w-[100%]"
                  value={newSavings.payment_type}
                  onChange={(e) =>
                    setNewSavings({
                      ...newSavings,
                      payment_type: e.target.value,
                    })
                  }
                />
              </div>

              {/* <div className="flex flex-col gap-2 my-4">
                  <label htmlFor="">Saving type</label>
                  <Input type="text" className="w-[100%]"
                  value={newShares.savings_type} onChange={(e) =>setNewShares({...newShares,savings_type: e.target.value})}
                  />  
                </div>  */}

              <div className="flex flex-col gap-2 my-4">
                <label htmlFor="">Saving type</label>
                <Select
                  className="w-[100%]"
                  placeholder="Select savings type"
                  value={newSavings.savings_type}
                  options={[
                    { label: "Shares", value: "shares" },
                    { label: " Savings", value: "savings" },
                    { label: "Building", value: "building" },
                    { label: "Development", value: "development" },
                  ]}
                  onChange={(value) =>
                    setNewSavings({ ...newSavings, savings_type: value })
                  }
                />
              </div>

              <div className=" flex flex-col gap-1 my-3">
                <input
                  type="submit"
                  placeholder="Login"
                  className="cursor-pointer h-[50px] rounded-md border border-slate-300 px-3 bg-blue-800 text-white "
                  value={"Add new shares"}
                />
              </div>
            </form>
          </Modal>
        </div>

        <Table
          columns={columns}
          dataSource={shares.map((shares, i) => ({
            no: i + 1,
            fullname: shares.fullname,
            gender: shares.gender,
            phonenumber: shares.mobile,
            amount: shares.amount,
            month: shares.month_paid,
            payment_type: shares.payment_type,
            savings_type: shares.savings_type,
          }))}
        />
      </DashboardLayout>
    </>
  );
};

export default Shares;
