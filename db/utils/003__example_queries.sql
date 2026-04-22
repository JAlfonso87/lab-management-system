USE lab_management_system;

-- CONSULTA DE REACTIVOS
	SELECT * FROM reagents;

-- CONSULTA DE REACTIVO POR MARCA
	SELECT * FROM reagents WHERE reagent_brand = 'MEYER';

-- CONSULTA DE MARCAS DISPONIBLES
	SELECT DISTINCT reagent_brand FROM reagents ORDER BY reagent_brand;
    
-- CONSULTA DE NOMBRES PLANOS DE REACTIVOS
	SELECT DISTINCT reagent_name FROM reagents ORDER BY reagent_name;
	    
-- PROCEDIMIENTOS ALMACENADOS DE CONSULTA
	-- RECUPERAR ID DE UBICACION DE NIVEL DE ANAQUEL (nivel, categoria de anaquel)
		CALL get_shelf_level_id(2, 'VERDE', @retrieved_shelf_level_id);
		SELECT @retrieved_shelf_level_id;
    
	-- RECUPERAR ID DE UBICACION DE LABORATORIO (nombre del laboratorio)
		CALL get_lab_id('EDAFOLOGIA', @retrieved_lab_id);
		SELECT @retrieved_lab_id;
        
	-- RECUPERAR INFO DE TECNICO POR LABORATORIO ASIGNADO
		CALL get_assigned_technician('EDAFOLOGIA');
        
	-- GENERAR CODIGO DE REACTIVO
		CALL generate_code(136, @codigo_reactivo);
        SELECT @codigo_reactivo;

	-- ENTRADA DE STOCK (TIPO, REACTIVO_ID, UNIDADES, UBICACION_ID, TECNICO_ID)
		CALL execute_operation('ENTRADA', 3, 10, 18, 1);
        
	-- CONSULTA DE INFORMACIÓN DE MOVIMIENTO POR ID
		CALL operation_details_by_id(1);