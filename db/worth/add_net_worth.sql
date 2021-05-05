INSERT INTO worth (sub_id, amount)
VALUES ($1, $2)
returning *;