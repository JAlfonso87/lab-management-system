USE lab_management_system;

CREATE TABLE IF NOT EXISTS seeder_status(
    seeder_id INT AUTO_INCREMENT PRIMARY KEY,
    seeder_status INT DEFAULT 0
);

INSERT INTO seeder_status (seeder_id, seeder_status) VALUES (1, 0);

CREATE TABLE IF NOT EXISTS reagents(
	reagent_id INT AUTO_INCREMENT PRIMARY KEY,
    reagent_name VARCHAR(100) NOT NULL,
    reagent_brand VARCHAR(20) NOT NULL,
    reagent_netweight VARCHAR(10) NOT NULL,
    reagent_risk VARCHAR(15),
    reagent_code VARCHAR(50) NULL UNIQUE,
    CHECK(
		reagent_risk = 'ROJO' OR
        reagent_risk = 'VERDE' OR
        reagent_risk = 'BLANCO' OR
		reagent_risk = 'AMARILLO' OR
        reagent_risk = 'AZUL'
    )
);

CREATE TABLE IF NOT EXISTS locations(
	location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_type VARCHAR(15) NOT NULL,
    CHECK (location_type = 'SHELF_LVL' OR location_type = 'LAB')
);

CREATE TABLE IF NOT EXISTS local_stocks(
	local_stock_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    reagent_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    local_stock_units INTEGER DEFAULT 0,
    CHECK(local_stock_units >= 0),
    FOREIGN KEY(reagent_id) REFERENCES reagents(reagent_id),
    FOREIGN KEY(location_id) REFERENCES locations(location_id),
	UNIQUE (reagent_id, location_id)
);

CREATE TABLE IF NOT EXISTS labs(
	lab_id INTEGER PRIMARY KEY NOT NULL,
    lab_name VARCHAR(30) NOT NULL UNIQUE,
    host_building CHAR NOT NULL,
    FOREIGN KEY(lab_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roles(
    role_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions(
    permission_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS roles_permissions(
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY(role_id, permission_id),
    FOREIGN KEY(role_id) REFERENCES roles(role_id),
    FOREIGN KEY(permission_id) REFERENCES permissions(permission_id)
);

CREATE TABLE IF NOT EXISTS users(
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_id INT NULL,
    role_id INT NOT NULL,
    user_first_name VARCHAR(30) NOT NULL,
    user_middle_name VARCHAR(20) NULL,
    user_last_name VARCHAR(20) NOT NULL,
    user_phone_number VARCHAR(20) NULL,
    user_username VARCHAR(20) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_status INT NOT NULL DEFAULT 0, # WHERE 0 MEANS PENDING, 1 MEANS ACTIVE, 2 MEANS DELETED
    FOREIGN KEY(lab_id) REFERENCES labs(lab_id),
    FOREIGN KEY(role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS requesters(
	requester_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    requester_first_name VARCHAR(30) NOT NULL,
    requester_middle_name VARCHAR(20) NULL,
    requester_last_name VARCHAR(20) NULL,
    requester_phone_number VARCHAR(20) NULL
);

CREATE TABLE IF NOT EXISTS teachers(
	teacher_id INTEGER PRIMARY KEY,
    FOREIGN KEY (teacher_id) REFERENCES requesters(requester_id)
);

CREATE TABLE IF NOT EXISTS subjects(
	subject_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(30) NOT NULL,
    subject_description VARCHAR(150) NULL
);

CREATE TABLE IF NOT EXISTS assigned_teachers(
	assignation_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    subject_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    assigned_working_hours INTEGER NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE IF NOT EXISTS thesis_authors(
	thesis_author_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    asessor_id INTEGER NOT NULL,
    project_title VARCHAR(60) NOT NULL,
    FOREIGN KEY(asessor_id) REFERENCES teachers(teacher_id)
);

CREATE TABLE IF NOT EXISTS requests(
	request_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    request_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS request_details(
	request_details_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    request_id INTEGER NOT NULL,
    local_stock_id INTEGER NOT NULL,
    requested_units INTEGER NOT NULL,
    CHECK(requested_units > 0),
    FOREIGN KEY (local_stock_id) REFERENCES local_stocks(local_stock_id),
    FOREIGN KEY (request_id) REFERENCES requests(request_id)
);

CREATE TABLE IF NOT EXISTS shelves(
	shelf_id INT AUTO_INCREMENT PRIMARY KEY,
    shelf_number INT NOT NULL,
    shelf_category VARCHAR(20) NOT NULL,
    host_building CHAR NOT NULL,
    CONSTRAINT uq_sh_per_building UNIQUE (host_building, shelf_number)
);

CREATE TABLE IF NOT EXISTS shelf_levels(
	shelf_level_id INT PRIMARY KEY,
    shelf_id INT NOT NULL,
    shelf_level_number INT NOT NULL,
    CHECK (shelf_level_number > 0 AND shelf_level_number < 5),
    FOREIGN KEY(shelf_level_id) REFERENCES locations(location_id) ON DELETE CASCADE,
    FOREIGN KEY(shelf_id) REFERENCES shelves(shelf_id),
    CONSTRAINT shelf_level_uniqueness UNIQUE (shelf_id, shelf_level_number)
);

CREATE TABLE IF NOT EXISTS transfer(
	transfer_id INT AUTO_INCREMENT PRIMARY KEY,
    reagent_id INT NOT NULL,
    user_id INT NOT NULL,
    local_stock_id INTEGER NOT NULL,
    transfer_type VARCHAR (10) NOT NULL,
    stock_difference INT NOT NULL DEFAULT 0,
    transfer_date DATETIME NOT NULL,

    CHECK (stock_difference >= 0),
    CHECK (
		transfer_type = 'IN' OR
        transfer_type = 'OUT'
    ),
    
    FOREIGN KEY (local_stock_id) REFERENCES local_stocks(local_stock_id),
    FOREIGN KEY (reagent_id) REFERENCES reagents(reagent_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS restocks(
    restock_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    reagent_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    local_stock_id INTEGER NOT NULL,
    restock_units INT NOT NULL DEFAULT 0,
    restock_date DATE NOT NULL,
    
    FOREIGN KEY (local_stock_id) REFERENCES local_stocks(local_stock_id),
    FOREIGN KEY (reagent_id) REFERENCES reagents(reagent_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);