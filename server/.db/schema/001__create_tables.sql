USE lab_management_system;

CREATE TABLE IF NOT EXISTS reagents(
	reagent_id INT AUTO_INCREMENT PRIMARY KEY,
    reagent_name VARCHAR(100) NOT NULL,
    reagent_brand VARCHAR(20) NOT NULL,
    reagent_netweight VARCHAR(10) NOT NULL,
    reagent_risk VARCHAR(15),
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
    location_building CHAR NOT NULL,
    location_type VARCHAR(15) NOT NULL,
    CHECK (location_type = 'NIVEL_ANAQUEL' OR location_type = 'LABORATORIO')
);

CREATE TABLE IF NOT EXISTS local_stocks(
	local_stock_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    reagent_id INTEGER NOT NULL,
    location_id INTEGER NOT NULL,
    local_stock_units INTEGER DEFAULT 0,
    CHECK(local_stock_units > 0),
    FOREIGN KEY(reagent_id) REFERENCES reagents(reagent_id),
    FOREIGN KEY(location_id) REFERENCES locations(location_id)
);

CREATE TABLE IF NOT EXISTS labs(
	lab_id INT PRIMARY KEY NOT NULL,
    lab_name VARCHAR(30) NOT NULL,
    FOREIGN KEY(lab_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS technicians(
	technician_id INT AUTO_INCREMENT PRIMARY KEY,
    lab_id INT NOT NULL UNIQUE,
    technician_first_name VARCHAR(30) NOT NULL,
    technician_middle_name VARCHAR(20) NOT NULL,
    technician_last_name VARCHAR(20) NULL,
    technician_username VARCHAR(20) NOT NULL UNIQUE,
    technician_password VARCHAR(255) NOT NULL,
    technician_phone_number VARCHAR(20) NULL,
    FOREIGN KEY(lab_id) REFERENCES labs(lab_id)
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
    requester_id INTEGER NOT NULL,
    technician_id INTEGER NOT NULL,
    request_date DATE NOT NULL,
    FOREIGN KEY (requester_id) REFERENCES requesters(requester_id),
    FOREIGN KEY (technician_id) REFERENCES technicians(technician_id)
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
    shelf_category VARCHAR(20) NOT NULL
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

CREATE TABLE IF NOT EXISTS operations(
	operation_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    reagent_id INTEGER NOT NULL,
    technician_id INTEGER NOT NULL,
    local_stock_id INTEGER NOT NULL,
    operation_type VARCHAR (10) NOT NULL,
    stock_difference INT NOT NULL DEFAULT 0,
    operation_date DATE NOT NULL,
    operation_description VARCHAR (150) DEFAULT 'DEFAULT DESCRIPTION.',
    
    CHECK (stock_difference >= 0),
    CHECK (
		operation_type = 'ENTRADA' OR
        operation_type = 'SALIDA'
    ),
    
    FOREIGN KEY (reagent_id) REFERENCES reagents(reagent_id),
    FOREIGN KEY (technician_id) REFERENCES technicians(technician_id),
    FOREIGN KEY (local_stock_id) REFERENCES local_stocks(local_stock_id)
);