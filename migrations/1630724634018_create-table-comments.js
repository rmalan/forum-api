exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'varchar(50)',
      notNull: true,
    },
    content: {
      type: 'text',
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
    is_delete: {
      type: 'boolean',
      notNull: true,
      default: 'false',
    },
  });

  pgm.addConstraint('comments', 'fk_comments_owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments_thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
