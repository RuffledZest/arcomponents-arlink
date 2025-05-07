-- Atomic Asset Handler for Permaweb
function handle(state, action)
    -- Initialize state if not exists
    state = state or {
        assets = {},
        nextId = 1
    }

    -- Validate action
    if not action.input then
        return { error = "No input provided" }
    end

    -- Create Asset
    if action.input.function == "create" then
        -- Validate required fields
        if not action.input.name or not action.input.description then
            return { error = "Name and description are required" }
        end

        -- Create new asset
        local asset = {
            id = tostring(state.nextId),
            name = action.input.name,
            description = action.input.description,
            topics = action.input.topics or {},
            creator = action.caller,
            data = action.input.data,
            contentType = action.input.contentType,
            assetType = action.input.assetType,
            metadata = action.input.metadata or {},
            createdAt = os.time(),
            updatedAt = os.time()
        }

        -- Store asset
        state.assets[asset.id] = asset
        state.nextId = state.nextId + 1

        return { state = state, result = asset }
    end

    -- Get Asset
    if action.input.function == "get" then
        local assetId = action.input.assetId
        if not assetId then
            return { error = "Asset ID is required" }
        end

        local asset = state.assets[assetId]
        if not asset then
            return { error = "Asset not found" }
        end

        return { result = asset }
    end

    -- List Assets
    if action.input.function == "list" then
        local assets = {}
        for id, asset in pairs(state.assets) do
            table.insert(assets, asset)
        end
        return { result = assets }
    end

    -- Update Asset
    if action.input.function == "update" then
        local assetId = action.input.assetId
        if not assetId then
            return { error = "Asset ID is required" }
        end

        local asset = state.assets[assetId]
        if not asset then
            return { error = "Asset not found" }
        end

        -- Only creator can update
        if asset.creator ~= action.caller then
            return { error = "Only creator can update asset" }
        end

        -- Update fields
        asset.name = action.input.name or asset.name
        asset.description = action.input.description or asset.description
        asset.topics = action.input.topics or asset.topics
        asset.data = action.input.data or asset.data
        asset.contentType = action.input.contentType or asset.contentType
        asset.assetType = action.input.assetType or asset.assetType
        asset.metadata = action.input.metadata or asset.metadata
        asset.updatedAt = os.time()

        state.assets[assetId] = asset
        return { state = state, result = asset }
    end

    -- Delete Asset
    if action.input.function == "delete" then
        local assetId = action.input.assetId
        if not assetId then
            return { error = "Asset ID is required" }
        end

        local asset = state.assets[assetId]
        if not asset then
            return { error = "Asset not found" }
        end

        -- Only creator can delete
        if asset.creator ~= action.caller then
            return { error = "Only creator can delete asset" }
        end

        state.assets[assetId] = nil
        return { state = state, result = { success = true } }
    end

    return { error = "Unknown function" }
end 