/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    comment_id: {
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
    },
    is_delete: {
      type: 'boolean',
      notNull: true,
      default: 'false',
    },
  });

  pgm.addConstraint('replies', 'fk_replies_owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies_comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
