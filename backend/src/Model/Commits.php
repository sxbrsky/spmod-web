<?php
    namespace App\Model;

    use PDO;
    use App\Base\AbstractModel;

    class Commits extends AbstractModel
    {
        public function hasHash(string $hash)
        {
            $sql = "SELECT commit_hash FROM {$this->table} WHERE commit_hash = :commit_hash";
            try {
                $stmt = $this->getDatabase()->prepare($sql);
                $stmt->bindParam(':commit_hash', $hash);
                $stmt->execute();

                $count = $stmt->fetchColumn();

                if ($count > 0)
                    return true;
                
                return false;

            } catch (PDOException $e) {
                echo $e->getMessage();
            }
        }

        public function add(string $hash, string $message)
        {
            $sql = "INSERT INTO {$this->table}(commit_hash, commit_msg) VALUES(?, ?)";
            try {
                return $this->getDatabase()->prepare($sql)->execute([$hash, $message]);
            } catch (PDOException $e) {
                echo $e->getMessage();
            }
        }

        public function get(string $hash) 
        {
            $sql = "SELECT id, commit_hash, commit_msg FROM {$this->table} WHERE commit_hash = :commit_hash";
            try {
                $stmt = $this->getDatabase()->prepare($sql);
                $stmt->bindParam(':commit_hash', $hash);
                $stmt->execute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC)[0];
            } catch (PDOException $e) {
                echo $e->getMessage();
            }
        }
    }