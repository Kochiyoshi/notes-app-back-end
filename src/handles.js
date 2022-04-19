/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const checkId = (notes) => {
  const id = nanoid(16);
  if ((notes.findIndex((note) => note.id === id)) !== -1) {
    checkId(notes);
  }
  return id;
};

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = checkId(notes);
  const now = new Date().toISOString();

  notes.push({
    id,
    title,
    createdAt: now,
    updatedAt: now,
    tags,
    body,
  });

  if (notes.findIndex((note) => note.id === id) !== -1) {
    // eslint-disable-next-line no-console
    console.log(`Add ${id} ${title}`);
    return h.response({
      status: 'success',
      message: 'Berhasil menambahkan note',
      data: {
        noteId: id,
        title,
      },
    }).code(201);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal menambahkan note',
  }).code(500);
};

const getAllNotesHandler = (request, h) => {
  if (!Array.isArray(notes) || !notes.length) {
    return h.response({
      status: 'fail',
      message: 'Note kosong',
    }).code(404);
  }
  return h.response({
    status: 'succes',
    message: 'Berhasil menampilkan semua note',
    data: {
      notes,
    },
  }).code(200);
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.find((note) => note.id === id);

  if (note !== undefined) {
    return h.response({
      status: 'success',
      message: 'Berhasil mengambil note',
      data: {
        note,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: `Note dengan ${id} tidak ada`,
  }).code(404);
};

const putNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;

  const updatedAt = new Date().toISOString();

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      tags,
      updatedAt,
      body,
    };

    return h.response({
      status: 'success',
      message: 'Note behasil di ubah',
      data: {
        noteId: id,
        title,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: `Note dengan id "${id}" tidak ditemukan`,
  }).code(404);
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const nodeIndex = notes.findIndex((note) => note.id === id);

  if (nodeIndex !== -1) {
    notes.splice(nodeIndex, 1);
    return h.response({
      status: 'success',
      message: `Note dengan id "${id}" berhasil di hapus`,
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: `Note dengan id ${id} tidak ditemukan`,
  }).code(404);
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  putNoteByIdHandler,
  deleteNoteByIdHandler,
};
