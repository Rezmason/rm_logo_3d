const makeLogoform = () => {
    const geometries = [];
    const makePusher = func => (...args) => geometries.push(func(...args));
    const [addCurve, addStraight] = [makePusher(makeCurve), makePusher(makeStraight)];

    const whatWasIThinking = Math.SQRT1_2;

    const thickness = 0.5;
    const width = 9.6 * whatWasIThinking;
    const height = 6 * whatWasIThinking;

    const xLeft = -width / 2;
    const xRight = width / 2;

    const yTop = height / 2;
    const yMiddle = 0.25 * whatWasIThinking;
    const yBottom = -height / 2;
    const rRadius = (yMiddle - yBottom) / 2 - thickness;
    const mRadius = height / 2 - thickness;

    const zBase = -0.5;
    const zFront = zBase + rRadius + thickness;
    const zBack = zBase - mRadius - thickness;

    const rSideRadius = zFront;

    addCurve((yTop - yMiddle) / 2, 0, 1, xLeft + 2.25, (yTop + yMiddle) / 2 - thickness, zBase, 0, 0, -0.5); // R straightforward curl
    addStraight((2.25 - rSideRadius - thickness), xLeft + rSideRadius + thickness, yTop - thickness, zBase, 0, 0.5); // R top left horizontal | straight bit
    addStraight((2.25 - rSideRadius - thickness), xLeft + rSideRadius + thickness, yMiddle - thickness, zBase, 0, 0.5); // R bottom left horizontal | straight bit
    addCurve(rSideRadius, 0.5, 1, xLeft + rSideRadius + thickness, yMiddle - thickness, zFront - thickness, 1.5); // R bottom left horizontal | bendy bit
    addStraight(yMiddle - yBottom, xLeft + 0.5, yMiddle, zFront, 0.5, 0, 0); // R bottom left vertical

    // • //addStraight(zFront - zBack - thickness * 2,  xRight - thickness, yBottom + thickness, zFront - thickness, 0, 1); // M bottom right base
    addStraight(zFront - zBack - thickness * 2, xLeft + thickness, yBottom + thickness, zFront - thickness, 0, 1); // R bottom left base

    addCurve(rRadius, 0, 1, xLeft + 1 + thickness + 0.25, (yMiddle + yBottom) / 2, 0, 0, 0.5, 0.5, t => {
      const r1 = t * 3;
      const r2 = t * 1.75;
      return t * r2 + (1 - t) * r1;
    }); // R helix
    addCurve(mRadius, 1.5, 2.5, 0.1, 0, 0, 0, 0.5, 0, t => {
      const r1 = t * 1.75;
      const r2 = t * (width / 2 - Math.SQRT1_2 + 0.1);
      return t * r2 + (1 - t) * r1;
    }); // M helix


    const mShootRadius = (zFront - zBack - thickness * 2) / 2;
    addCurve(mShootRadius, 0, 1, xRight - thickness, yBottom + thickness * 1.5, zFront - mShootRadius, 0, 0.5, 0); // M hidden shoot | curvy bit
    addStraight(thickness * 1.5, xRight - thickness, yBottom, zBack + thickness * 2, 1.5); // M hidden shoot | straight bit

    // • //addStraight(height, xRight - thickness, height / 2, zFront, 0.5, 0, 0); // M right vertical
    // • //addStraight(rRadius - thickness, xRight - thickness, height / 2 - thickness, 0, 0, 0); // M post-helix

    // • //addStraight(height, xRight - thickness, height / 2, zFront, 0.5, 0, 0); // M right vertical

    addCurve(rRadius, 0, 0.5, xRight - thickness, yTop - rRadius - thickness, 0, 0, 0.5, 0.5); // M right vertical | bendy bit
    addStraight(height - rRadius - thickness, xRight - thickness, height / 2 - rRadius - thickness, zFront, 0.5, 0, 0); // M right vertical | straight bit

    addCurve(rSideRadius, 0.5, 1, xLeft + rSideRadius + thickness, yTop - thickness, zBase - rSideRadius, 0.5); // R bottom left horizontal | bendy bit
    addStraight((zBase - rSideRadius) - zBack - thickness, xLeft + thickness, yTop - thickness, zBase - rSideRadius, 0, 1); // R top left extension | curvy bit

    return THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
}
