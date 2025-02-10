const express = require("express");
const app = express();
const port = process.env.PORT || 3100;
const cors = require("cors");
const logger = require("morgan");
const { provinces } = require("./data/provinces.data");
const { districts } = require("./data/districts.data");
const { wards } = require("./data/wards.data");
const removeAccents = require("./removeAccents");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/provinces", (req, res) => {
  const { id, name, slug, type, name_with_type, code, isDeleted } = req.query;
  let filteredProvinces = provinces.filter((province) => {
    return (
      (!id || province.id === id) &&
      (!name ||
        removeAccents(province.name)
          .toLowerCase()
          .includes(name.toLowerCase())) &&
      (!slug || province.slug === slug) &&
      (!type || province.type === type) &&
      (!name_with_type ||
        removeAccents(province.name_with_type)
          .toLowerCase()
          .includes(name_with_type.toLowerCase())) &&
      (!code || province.code === code) &&
      (isDeleted === undefined || province.isDeleted.toString() === isDeleted)
    );
  });

  res.status(200).json({
    message: "get province list successfully",
    data: { filteredProvinces },
  });
});

app.get("/districts", (req, res) => {
  const { parent_code } = req.query;
  const filteredDistricts = districts.filter(
    (district) => district.parent_code === parent_code
  );
  res.status(200).json({
    message: "get district list successfully",
    data: { filteredDistricts },
  });
});

app.get("/wards", (req, res) => {
  const { parent_code } = req.query;
  const filteredWards = wards.filter(
    (ward) => ward.parent_code === parent_code
  );
  res.status(200).json({
    message: "get ward list successfully",
    data: { filteredWards },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
