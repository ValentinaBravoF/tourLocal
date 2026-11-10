
import { Router } from 'express';
import horarios from '../data/horarios.js';

const router = Router();

router.get('/', (req, res) => {
  const { status } = req.query;

  if (status) {
    const estadosValidos = [...new Set(horarios.map(h => h.status))];

    if (!estadosValidos.includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    return res.json(horarios.filter(h => h.status === status));
  }

  res.json(horarios);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }

  const horario = horarios.find(h => h.id === id);

  if (!horario) {
    return res.status(404).json({ error: 'Horario no encontrado' });
  }

  res.json(horario);
});

export default router;
