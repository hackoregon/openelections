import { validate } from 'class-validator';

export async function checkDto(dto) {
    const validationErrors = await validate(dto, { validationError: { target: false } });
    if (validationErrors.length) {
        throw new Error(
            validationErrors
                .map(validationError =>
                    Object.keys(validationError.constraints).map(key => validationError.constraints[key])
                )
                .join(', ')
        );
    }
}
