// ** Import React
import { useState } from "react";

// ** Import Components
import HeaderTambahKa from "../../../components/daftar-ka/tambah-ka/HeaderTambahKa";
import ModalDaftarKa from "../../../components/daftar-ka/ModalDaftarKa";
import NavDetailka from "../../../components/daftar-ka/NavDetailka";
import FormTambahKa from "../../../components/daftar-ka/tambah-ka/FormTambahKa";
import GerbongDaftarKa from "../../../components/daftar-ka/tambah-ka/GerbongDaftarKa";

// ** Import Redux
import { useDispatch } from "react-redux";
import { addIdKa } from "../../../redux/daftar-ka/daftarKaSlices";

// ** Import Other
import { useLocation, useNavigate } from "react-router-dom";
import { idGenerator } from "generate-custom-id";
import { baseUrl } from "../../../services/base";
import axios from "axios";
import useSWR from "swr";

const fetcherTambahKa = (url, payload) =>
  axios.post(url, payload).then((res) => res.data);

const fetcherEditKa = (url, payload) =>
  axios.put(url, payload).then((res) => res.data);

const fetcherGerbongKa = (url) => axios.get(url).then((res) => res.data);

const TambahKa = () => {
  const { state } = useLocation();

  const dataEdit = {
    train_id: state?.train_id,
    code_train: state?.code_train,
    name: state?.name,
    route: state?.route.map((data) => ({
      station_id: data?.station_id,
      name: data?.station?.name,
      arrive_time: data?.arrive_time,
    })),
    status: state?.status,
  };

  const { data: gerbongKa, isLoading } = useSWR(
    baseUrl("/public/train-carriage?limit=9999"),
    fetcherGerbongKa
  );

  const findGerbong = isLoading
    ? null
    : gerbongKa.data.filter(
        (gerbong) => gerbong.train.train_id === dataEdit.train_id
      );

  console.log(gerbongKa);

  const dataEditGerbong = findGerbong?.map((gerbong) => ({
    class: gerbong.train.class,
    name: gerbong.name,
    price: gerbong.train.price,
    train_id: gerbong.train.train_id,
  }));

  // ** Local State
  const [input, setInput] = useState({
    status: state ? dataEdit.status : "unavailable",
    name: state ? dataEdit.name : "",
    rute: state ? dataEdit.route : [],
  });

  const [dataGerbong, setDataGerbong] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nav, setNav] = useState("informasi");
  const [modal, setModal] = useState(false);
  const [modalGerbong, setModalGerbong] = useState(false);

  const handleOnChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const findNoneJadwal = input.rute.filter((r) => r.arrive_time === "");

  const validate =
    input.name === "" || input.rute.length === 0 || findNoneJadwal.length >= 1;

  const findNoneNameGerbong = dataGerbong.filter((g) => g.name === "");

  const validateGerbong =
    dataGerbong?.length === 0 || findNoneNameGerbong.length >= 1;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const code_train = idGenerator("example", 2, 1, {
    prefix: "TRAIN",
    trace: true,
  });

  const handleTambahInformasiKa = () => {
    setLoading(true);

    fetcherTambahKa(baseUrl("/admin/train"), {
      code_train: code_train,
      name: input.name,
      route: input.rute.map((r) => ({
        station_id: r.station_id,
        arrive_time: r.arrive_time,
      })),
      status: input.status,
    })
      .then((res) => {
        const {
          data: { train_id },
        } = res;

        dispatch(addIdKa(train_id));

        setNav("gerbong");

        setModal(false);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleEditInformasiKa = () => {
    setLoading(true);

    fetcherEditKa(baseUrl(`/admin/train/${dataEdit.train_id}`), {
      code_train: dataEdit.code_train,
      name: input.name,
      route: input.rute.map((r) => ({
        station_id: r.station_id,
        arrive_time: r.arrive_time,
      })),
      status: input.status,
    })
      .then(() => {
        navigate("/daftar-ka");

        setNav("gerbong");

        setModal(false);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleTambahGerbong = () => {
    setLoading(true);

    fetcherTambahKa(baseUrl("/admin/train-carriage"), dataGerbong)
      .then(() => {
        setModal(false);

        setLoading(false);

        navigate("/daftar-ka");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="absolute left-0 right-0 bg-[#F5F6F8] pb-20">
      <HeaderTambahKa
        validate={
          state === null
            ? nav === "informasi"
              ? validate
              : validateGerbong
            : validate
        }
        setModal={setModal}
        setModalGerbong={setModalGerbong}
        nav={nav}
        isEdit={state}
      />

      <div className="w-[1142px] min-h-full mt-[64px] mx-auto bg-white rounded-3xl shadow-[0_1px_10px_rgb(0,0,0,0.2)]">
        <NavDetailka nav={nav} setNav={setNav} isEdit={state} />

        {nav === "informasi" ? (
          <FormTambahKa
            input={input}
            edit={state}
            dataEdit={dataEdit}
            setInput={setInput}
            handleOnChangeInput={handleOnChangeInput}
          />
        ) : (
          <GerbongDaftarKa
            loading={isLoading}
            edit={state}
            dataEdit={state === null ? null : findGerbong}
            datas={state === null ? dataGerbong : dataEditGerbong}
            setDatas={setDataGerbong}
          />
        )}
      </div>

      {modal && (
        <ModalDaftarKa
          title="Ingin Menyimpan?"
          description=" This blog post has been published. Team members will be able to edit this post and republish changes."
          bgButton="bg-[#0080FF]"
          titleButton="Iya, Simpan"
          setModal={setModal}
          handle={
            state === null ? handleTambahInformasiKa : handleEditInformasiKa
          }
          loading={loading}
        />
      )}

      {modalGerbong && (
        <ModalDaftarKa
          title="Ingin Menyimpan?"
          description=" This blog post has been published. Team members will be able to edit this post and republish changes."
          bgButton="bg-[#0080FF]"
          titleButton="Iya, Simpan"
          setModal={setModalGerbong}
          handle={handleTambahGerbong}
          loading={loading}
        />
      )}
    </div>
  );
};

export default TambahKa;
