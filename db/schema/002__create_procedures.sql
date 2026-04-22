USE lab_management_system;

DELIMITER $$
-- BUSCAR ID DE UBICACIÓN DE UN NIVEL DE ANAQUEL
	$$CREATE PROCEDURE get_shelf_level_id(
		IN shelf_level_number INT,
		IN shelf_category VARCHAR(20),
        OUT location_id INT
	)
	BEGIN
		SELECT locations.location_id FROM locations
			INNER JOIN shelf_levels 
				ON locations.location_id = shelf_levels.shelf_level_id
				AND locations.location_type = 'NIVEL_ANAQUEL'
				AND shelf_levels.shelf_level_number = shelf_level_number
					INNER JOIN shelves 
						ON shelf_levels.shelf_id = shelves.shelf_id 
						AND shelves.shelf_category = shelf_category
		INTO location_id;
	END$$
    
DELIMITER $$
-- BUSCAR ID DE UBICACIÓN DE UN LABORATORIO
	$$CREATE PROCEDURE get_lab_id(
		IN lab_name VARCHAR(30),
        OUT lab_id INT
	)
	BEGIN
		SELECT locations.location_id FROM locations
			INNER JOIN labs 
				ON locations.location_id = labs.lab_id
				AND locations.location_type = 'LABORATORIO'
				AND labs.lab_name = lab_name
		INTO lab_id;
	END$$
    
DELIMITER $$
-- INICIALIZAR NIVELES
	$$CREATE PROCEDURE init_levels(
		IN shelf_id INT,
		IN location_building CHAR(1)
	)
	BEGIN
		DECLARE level_idx INT DEFAULT 0;
        SET level_idx = 1;
        
        REPEAT
			INSERT INTO locations (location_building, location_type) VALUES (location_building, 'NIVEL_ANAQUEL');
			INSERT INTO shelf_levels (shelf_level_id, shelf_id, shelf_level_number) VALUES (LAST_INSERT_ID(), shelf_id, level_idx);
            SET level_idx = level_idx + 1;
		UNTIL level_idx > 4
        END REPEAT;
	END$$

DELIMITER $$
-- INICIALIZAR ALMACÉN
	$$CREATE PROCEDURE init_storage (
		IN location_building CHAR(1)
    ) 
    BEGIN 
		DECLARE shelf_idx INT DEFAULT 0;
		SET shelf_idx = 1;
	 -- INICIALIZAR ANAQUELES
		INSERT INTO shelves(shelf_category) VALUES ('ROJO'), ('VERDE'), ('BLANCO'), ('AZUL');
        REPEAT
			CALL init_levels(shelf_idx, location_building);
            SET shelf_idx = shelf_idx + 1;
        UNTIL shelf_idx > 4
        END REPEAT;
    END$$

DELIMITER $$
-- INICIALIZAR LABORATORIOS
	$$CREATE PROCEDURE init_labs(
		IN location_building CHAR(1)
    )
    BEGIN 
		INSERT INTO locations (location_building, location_type) VALUES (location_building, 'LABORATORIO');
		INSERT INTO labs(lab_id, lab_name) VALUES (LAST_INSERT_ID(), 'ALIMENTOS');
        
		INSERT INTO locations (location_building, location_type) VALUES (location_building, 'LABORATORIO');
        INSERT INTO labs(lab_id, lab_name) VALUES (LAST_INSERT_ID(), 'EDAFOLOGIA');
        
		INSERT INTO locations (location_building, location_type) VALUES (location_building, 'LABORATORIO');
        INSERT INTO labs(lab_id, lab_name) VALUES (LAST_INSERT_ID(), 'BIOTECNOLOGIA');
        
		INSERT INTO locations (location_building, location_type) VALUES (location_building, 'LABORATORIO');
        INSERT INTO labs(lab_id, lab_name) VALUES (LAST_INSERT_ID(), 'BIOLOGIA CELULAR');
    END$$
    
DELIMITER $$
-- INICIALIZAR LABORATORIOS
	$$CREATE PROCEDURE add_lab_technician(
		IN lab_name VARCHAR(30),
		IN technician_first_name VARCHAR(30),
		IN technician_middle_name VARCHAR(20),
		IN technician_last_name VARCHAR(20),
		IN technician_phone_number VARCHAR(20)
    )
    BEGIN 
		CALL get_lab_id(lab_name, @retrieved_lab_id);
		INSERT INTO technicians(lab_id, technician_first_name, technician_middle_name, technician_last_name, technician_phone_number) VALUES (
			@retrieved_lab_id, 
            technician_first_name, 
            technician_middle_name,
            technician_last_name,
            technician_phone_number
		);
    END$$

DELIMITER $$
-- RECUPERAR INFO DE TECNICO POR LABORATORIO ASIGNADO
	$$CREATE PROCEDURE get_assigned_technician(
		IN lab_name VARCHAR(30)
    )
    BEGIN 
		SELECT 
			CONCAT(technicians.technician_first_name, ' ', technicians.technician_middle_name, ' ', technicians.technician_last_name) AS nombre,
            technicians.technician_phone_number AS telefono_de_contacto,
            labs.lab_name AS laboratorio_asignado
		FROM technicians INNER JOIN labs
			ON technicians.lab_id = labs.lab_id
            AND labs.lab_name = lab_name;
    END$$

DELIMITER $$
-- RECUPERAR ID DE STOCK LOCAL
	$$CREATE PROCEDURE get_local_stock_id(
		IN reagent_id INT,
        IN location_id INT,
        OUT local_stock_id INT
    )
    BEGIN
		DECLARE evaluation INT;
		SELECT local_stock_id FROM local_stocks WHERE
			local_stocks.reagent_id = reagent_id AND
            local_stocks.location_id = location_id 
		INTO evaluation;
        
        SET local_stock_id = evaluation;
    END$$
    
DELIMITER $$
-- GENERAR CODIGO DE REACTIVO TRADUCIBLE A BARRAS
	$$CREATE PROCEDURE generate_code(
		IN reagent_id INT,
        OUT reagent_code VARCHAR(20)
    )
    BEGIN 
		DECLARE blanks INT DEFAULT 0;
        DECLARE blank_position INT DEFAULT 1;
        DECLARE previous_blank_position INT DEFAULT 0;
        DECLARE segment VARCHAR(10) DEFAULT '';
		DECLARE segment_length INT DEFAULT 0;
        
		DECLARE reagent_name_holder VARCHAR(100);
		DECLARE reagent_brand_holder VARCHAR(20);
		DECLARE reagent_netweight_holder VARCHAR(10);
		DECLARE reagent_risk_holder VARCHAR(15);
        
		SELECT reagents.reagent_name FROM reagents WHERE reagents.reagent_id = reagent_id INTO reagent_name_holder;
		SELECT reagents.reagent_brand FROM reagents WHERE reagents.reagent_id  = reagent_id INTO reagent_brand_holder;
		SELECT reagents.reagent_netweight FROM reagents WHERE reagents.reagent_id  = reagent_id INTO reagent_netweight_holder;
		SELECT reagents.reagent_risk FROM reagents WHERE reagents.reagent_id  = reagent_id INTO reagent_risk_holder;
        
        IF LOCATE('-', reagent_name_holder) > 0
        THEN
			SET reagent_code = 
				CONCAT(
					SUBSTRING(reagent_name_holder, REGEXP_INSTR(reagent_name_holder, '[A-Za-z]'), 6), -- LOS PRIMEROS 6 CARACTERES DEL NOMBRE
                    SUBSTRING(reagent_brand_holder, 1, 3), -- LOS PRIMEROS 3 CARACTERES DE LA MARCA
                    LPAD(SUBSTRING(reagent_netweight_holder, 1, REGEXP_INSTR(reagent_netweight_holder, '[A-Za-z]') - 1), 4, 0), -- CANTIDAD POR UNIDAD
					SUBSTRING(reagent_risk_holder, 1, 1) -- LA PRIMERA LETRA DE CATEGORIA DE RIESGO
                );		
		ELSE
			SELECT (LENGTH(reagent_name_holder) - LENGTH(REPLACE(reagent_name_holder, ' ', ''))) INTO blanks;
            IF blanks > 2 THEN SET blanks = 2; END IF;
			SET segment_length = 6 / (blanks + 1);
            REPEAT
				IF SUBSTRING(reagent_name_holder, blank_position, 1) = ' ' 
                THEN
					SET segment = CONCAT(segment, SUBSTRING(reagent_name_holder, previous_blank_position + 1, segment_length));
					SET segment = CONCAT(segment, SUBSTRING(reagent_name_holder, blank_position + 1, segment_length));
                    SET previous_blank_position = blank_position;
                    SET blanks = blanks - 1;
				END IF;
				SET blank_position = blank_position + 1;
            UNTIL blanks <=  0
            END REPEAT;
            SET reagent_code = 
				CONCAT(
					segment, -- LOS PRIMEROS 6 CARACTERES DEL NOMBRE
                    SUBSTRING(reagent_brand_holder, 1, 3), -- LOS PRIMEROS 3 CARACTERES DE LA MARCA
                    LPAD(SUBSTRING(reagent_netweight_holder, 1, REGEXP_INSTR(reagent_netweight_holder, '[A-Za-z]') - 1), 4, 0), -- CANTIDAD POR UNIDAD
					SUBSTRING(reagent_risk_holder, 1, 1) -- LA PRIMERA LETRA DE CATEGORIA DE RIESGO
                );	
		END IF;
    END$$

DELIMITER $$
	$$CREATE PROCEDURE execute_operation(
		IN operation_type VARCHAR(20),
        IN reagent_id INT,
        IN stock_difference INT,
        IN location_id INT,
        IN technician_id INT
    )
    BEGIN
		IF operation_type = 'ENTRADA'
        THEN
			CALL get_local_stock_id(reagent_id, location_id, @state);
            IF @state IS NOT NULL
            THEN
				UPDATE local_stocks SET local_stocks.local_stock_units = local_stocks.local_stock_units + stock_difference;
                INSERT INTO operations (reagent_id, technician_id, local_stock_id, operation_type, stock_difference, operation_date)
					VALUES (reagent_id, technician_id, @state, 'ENTRADA', stock_difference, NOW());
			ELSE
				INSERT INTO local_stocks (reagent_id, location_id, local_stock_units) VALUES (reagent_id, location_id, stock_difference);
                INSERT INTO operations (reagent_id, technician_id, local_stock_id, operation_type, stock_difference, operation_date)
					VALUES (reagent_id, technician_id, LAST_INSERT_ID(), 'ENTRADA', stock_difference, NOW());
            END IF;
        END IF;
    END$$
    
DELIMITER $$
$$CREATE PROCEDURE load_template()
	BEGIN
    -- INICIALIZAR UBICACIONES
		CALL init_storage('A');
		CALL init_labs('A');
	-- INICIALIZAR TÉCNICOS
		CALL add_lab_technician('EDAFOLOGIA', 'MARTIN', 'GUERRA', 'SANCHEZ', '+52-000-000-0000');
	-- INICIALIZAR STOCK
    END$$
    
DELIMITER $$
$$CREATE PROCEDURE get_location_info_by_id(
	IN location_id INT,
    OUT location_info VARCHAR(50)
)
BEGIN
	DECLARE location_type VARCHAR(15);
	DECLARE lab_name VARCHAR(30);
	DECLARE shelf_id INT;
    DECLARE shelf_level_number INT;
    
    SELECT locations.location_type FROM locations WHERE locations.location_id = location_id INTO location_type;
    IF location_type = 'LABORATORIO'
    THEN
		SELECT labs.lab_name FROM labs WHERE labs.lab_id = location_id INTO lab_name;
		SET location_info = CONCAT('LABORATORIO DE', ' ', lab_name);
	ELSE
		SELECT shelf_levels.shelf_level_number, shelf_levels.shelf_id INTO shelf_level_number, shelf_id FROM shelf_levels
			WHERE shelf_levels.shelf_level_id = location_id;
		SET location_info = CONCAT('ALMACEN: ANAQUEL ', shelf_id, ' NIVEL ', shelf_level_number);
    END IF;
END$$

DELIMITER $$
$$CREATE PROCEDURE get_technician_by_id(
	IN technician_id INT,
    OUT nombre_tecnico VARCHAR(70)
)
BEGIN
	SELECT CONCAT(technicians.technician_first_name, ' ', technicians.technician_middle_name, ' ', technicians.technician_last_name) INTO nombre_tecnico
		FROM technicians WHERE technicians.technician_id = technician_id;
END$$

DELIMITER $$
$$CREATE PROCEDURE operation_details_by_id(
	IN operation_id INT
)
BEGIN
	# DECLARE stock_location VARCHAR(50);
    DECLARE location_id INT;
    DECLARE technician_id INT;
    
    SELECT local_stocks.location_id FROM local_stocks INNER JOIN operations
    ON local_stocks.local_stock_id = operations.local_stock_id 
    WHERE operations.operation_id = operation_id
	INTO location_id;
    CALL get_location_info_by_id(location_id, @location);
	
    SELECT operations.technician_id INTO technician_id FROM operations WHERE operations.operation_id = operation_id;
    CALL get_technician_by_id(technician_id, @lab_technician);
    
    SELECT
		operations.operation_id AS ID_MOVIMIENTO,
        @location AS UBICACION,
        reagents.reagent_name AS NOMBRE_REACTIVO,
		reagents.reagent_brand AS MARCA_REACTIVO,
        operations.stock_difference AS DIFERENCIA_DE_STOCK,
        operations.operation_type AS TIPO_MOVIMIENTO,
        operations.operation_date AS FECHA_MOVIMIENTO,
        @lab_technician AS APROBÓ
    FROM operations INNER JOIN reagents ON operations.reagent_id = reagents.reagent_id;
END$$

DELIMITER ;