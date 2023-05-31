// ** Import React
import { useState } from "react";

// ** Import Components
import ModalDaftarKa from "../../components/daftar-ka/ModalDaftarKa";
import Bar from "../../components/daftar-ka/Bar";

// ** import Other
import { useNavigate } from "react-router-dom";
import TableDaftarKa from "../../components/daftar-ka/TableDaftarKa";
import useSWR from "swr";
import { baseUrl } from "../../services/base";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const DaftarKA = () => {
  const { data: daftarKa, isLoading } = useSWR(
    baseUrl("/admin/train"),
    fetcher
  );

  // ** Local State
  const [modal, setModal] = useState(false);

  const navigate = useNavigate("");

  const handleAdd = () => {
    navigate("/daftar-ka/tambah-ka");
  };

  return (
    <div className="relative h-full bg-white">
      <div className=" bg-white pl-3 pr-7 pt-3 pb-6 space-y-6">
        <h1 className="text-[34px] font-bold">Daftar Kereta Api</h1>

        <Bar setModal={setModal} />
      </div>

      <div className="pt-8 ">
        <div className="flex justify-between border-b pb-5 px-10 mb-1">
          <h1 className="text-[16px] font-[600] text-[#262627]">
            Nama Kereta Api
          </h1>
          <h1 className="text-[16px] font-[600] text-[#262627]">
            Nomor Kereta Api
          </h1>
          <h1 className="mr-[32px] text-[16px] font-[600] text-[#262627]">
            Status keaktifan
          </h1>
        </div>

        {isLoading && <p className="text-center mt-6">loading....</p>}

        {daftarKa?.data.map((ka, index) => (
          <TableDaftarKa key={ka.train_id} data={ka} index={index} />
        ))}
      </div>

      {modal && (
        <ModalDaftarKa
          title="Ingin Menambahkan Data KA?"
          description=" This blog post has been published. Team members will be able to edit this post and republish changes."
          bgButton="bg-[#0080FF]"
          titleButton="Iya, Tambahkan"
          setModal={setModal}
          handle={handleAdd}
        />
      )}
    </div>
  );
};

export default DaftarKA;
