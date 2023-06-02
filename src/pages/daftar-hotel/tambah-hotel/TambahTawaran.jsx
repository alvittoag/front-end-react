import React from "react";

//** Import Others
import assets from "../../../assets/assets";
import { Link } from "react-router-dom";
import FormAddPenawaran from "../../../components/daftar-hotel/tambah-hotel/daftar-kamar/FormAddPenawaran";

const TambahTawaran = () => {
  return (
    <div className="bg-[#FFFFFF] fixed overflow-y-auto left-0 right-0 h-full">
      <div className="space-y-6 bg-white pt-7 pb-4 px-8">
        <h1 className="text-[34px] font-[700] text-[#262627]">Tambah Penawaran</h1>

        <div className="flex items-center justify-between">
          <Link to="/daftar-hotel/tambah-hotel/tambah-kamar" className="flex items-center gap-2 ml-2">
            <img src={assets.iconKembaliDaftarKa} alt="back" />

            <h5 className="text-[#0080FF] text-[16px] mt-[1px]">Kembali</h5>
          </Link>

          <button
            //   disabled={validate}
            //   onClick={() => setModal(true)}
            className="px-8 py-[13.5px] font-bold text-white disabled:bg-[#B3D9FF] bg-[#0080FF] flex gap-3 items-center rounded-lg disabled:cursor-not-allowed"
          >
            <h1 className="mt-[1.2px]">Tambah Data Penawaran</h1>
            <img src={assets.iconSaveHotel} alt="button" />
          </button>
        </div>
      </div>

      <FormAddPenawaran />
    </div>
  );
};

export default TambahTawaran;
