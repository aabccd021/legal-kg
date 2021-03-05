type Mahasiswa = {
  type: 'mahasiswa';
  npm: number;
};
type Dosen = {
  type: 'dosen';
  dosenId: number;
  gelar: string;
};

type Civitas = Mahasiswa | Dosen;

function getCivitas(): Civitas {}

const xCivitas = getCivitas();

if (xCivitas.type === 'mahasiswa') {
  xCivitas.npm;
  xCivitas.gelar;
} else {
  xCivitas.gelar;
}
