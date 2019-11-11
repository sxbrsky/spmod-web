<?php
    namespace App\Base;

    use App\Base\Database;
    use PDO;
    
    abstract class AbstractModel
    {
        protected $db = null;
        protected $table = null;

        public function __construct(Database $db)
        {
            $this->db = $db;
            
            $parts = explode('\\', static::class);
            $this->table = end($parts);
        }

        public function getDatabase()
        {
            return $this->db->getConnection();
        }
        public function find(int $id)
        {
            $sql = "SELECT * FROM {$this->table} WHERE id = :id";
            try {
                $stmt = $this->getDb()->prepare($sql);
                $stmt->bindParam(':id', $build);
                $stmt->execute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                exit($e->getMessage());
            }
        }
        
        public function findAll()
        {
            $sql = "SELECT * FROM {$this->table}";
            try {
                $stmt = $this->getDb()->prepare($sql);
                $stmt->execute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                exit($e->getMessage());
            }
        }
    }