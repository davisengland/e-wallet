INSERT INTO expenses (sub_id, amount, month, category, date)
VALUES ($1, $2, $3, $4, $5)
returning *;