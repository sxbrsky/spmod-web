<?php
    namespace App\Base;

    use App\Base\Database;
    use PDO;
    abstract class Model
    {
        protected $db = null;

        public function __construct(Database $db)
        {
            $parts = explode('\\', static::class);
            $this->table = end($parts);
            $this->db = $db;
        }

        public function getDb()
        {
            return $this->db->getConnection();
        }

        public function find(int $build)
        {
            $sql = "SELECT * FROM builds WHERE build = :build";
            try {
                $stmt = $this->getDb()->prepare($sql);
                $stmt->bindParam(':build', $build);
                $stmt->execute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                exit($e->getMessage());
            }
        }
        
        public function findAll()
        {
            $sql = "SELECT * FROM builds";
            try {
                $stmt = $this->getDb()->prepare($sql);
                $stmt->execute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                exit($e->getMessage());
            }
        }
    }