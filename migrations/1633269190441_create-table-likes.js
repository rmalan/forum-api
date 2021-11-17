exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    owner: {
      type: 'varchar(50)',
      notNull: true,
    },
    date: {
      type: 'text',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('likes', 'fk_likes_owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('likes', 'fk_likes_comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
